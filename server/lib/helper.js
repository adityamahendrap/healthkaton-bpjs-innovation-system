export let openAiRequestCount = 0;

export const icrementOpenAiRequestCount = () => {
  openAiRequestCount++;
}

export const resetOpenAiRequestCount = async () => {
  openAiRequestCount = 0;
}

export const handleRateLimit = async () => {
  console.log('Waiting 1 min for OpenAI API rate limit...');
  await new Promise(resolve => setTimeout(resolve, 60000));
  openAiRequestCount = 0;
  console.log('OpenAI API rate limit reset.');
};
