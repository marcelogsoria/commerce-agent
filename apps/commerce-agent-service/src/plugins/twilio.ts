import 'dotenv/config';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import twilio, { Twilio } from 'twilio';

// --- Environment Variable Validation ---
const {
  TWILIO_ACCOUNT_SID: accountSid,
  TWILIO_AUTH_TOKEN: authToken,
  TWILIO_NUMBER: twilioNumber,
} = process.env;

if (!accountSid || !authToken || !twilioNumber) {
  throw new Error('Twilio environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER) must be set.');
}

// --- Twilio Client Initialization ---
const twilioClient = twilio(accountSid, authToken);

// --- Type Augmentation ---
// This tells TypeScript that we are adding new properties to the Fastify instance.
declare module 'fastify' {
  interface FastifyInstance {
    twilio: Twilio;
    twilioNumber: string;
    twilioAccountSid: string;
  }
}

// --- Plugin ---
const twilioPlugin = fp(async (fastify: FastifyInstance) => {
  fastify.decorate('twilio', twilioClient);
  fastify.decorate('twilioNumber', twilioNumber);
  fastify.decorate('twilioAccountSid', accountSid);
});

export default twilioPlugin;
