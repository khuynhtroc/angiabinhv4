import { checkAndRunSocialListeningAutoPilot } from './lib/scheduler-runner.ts';

async function main() {
  console.log('Testing Social Listening Auto-Pilot execution...');
  const result = await checkAndRunSocialListeningAutoPilot(true);
  console.log('RESULT:', JSON.stringify(result, null, 2));
}

main().catch(console.error);
