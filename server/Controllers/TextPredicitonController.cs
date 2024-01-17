using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Models;


namespace server.Controllers;

    [Route("api/[controller]")]
    [ApiController]
    public class TextPredictionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TextPredictionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

     // GET: api/TextPrediciton
    [HttpGet]
    public async Task<String> UseChatGPT(string query)
    {
        // Base Prompt, not complete
        string basePrompt ="Plese continue the initial input obeing the following rules, even if just one word or not even a complete word" +
            "and don't say anything else:(" +
            "Response rules: " +
            " 1. Use all the given input as the start off your output" +
            " 2. Do not add more than 10 words to the output respnse" +
            " 3. Predict what the user is trying to say."+
            " 4. Keep all the words in your output"+
            " 5. If a word is not complete you can complete is with what you think the user was trying to say"+
             "Initial Input:" + query;

        string GPT_API_KEY = _configuration.GetConnectionString("GPT_API_KEY");

        OpenAIAPI api = new OpenAIAPI(GPT_API_KEY);
        var chat = api.Chat.CreateConversation();
        chat.AppendUserInput(basePrompt);
        chat.Model = Model.GPT4_Turbo;
        string response = await chat.GetResponseFromChatbotAsync();

        return response;

    }


}

