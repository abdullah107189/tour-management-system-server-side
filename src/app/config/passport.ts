/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
// GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No get email" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            isVerified: true,
            role: Role.USER,
            auths: {
              provider: "google",
              providerId: profile.id,
            },
          });
        }
        return done(null, user, { message: "User created successfully" });
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

// local
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done: any) => {
      try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
          return done(null, false, { message: "User don't exist" });
        }
        const isGoogleAuthenticate = existingUser.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );
        if (isGoogleAuthenticate && !existingUser.password) {
          return done(null, false, {
            message:
              "Your are login using google. Not have password, so please set your password",
          });
        }
        const isPasswordMatch = await bcryptjs.compare(
          password as string,
          existingUser.password as string
        );
        if (!isPasswordMatch) {
          return done(null, false, { message: "Password don't match" });
        }
        return done(null, existingUser);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
