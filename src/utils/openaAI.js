import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: 'abs',
   dangerouslyAllowBrowser: true,
});

export default openai;