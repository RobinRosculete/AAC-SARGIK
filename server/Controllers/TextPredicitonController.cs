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
    public async Task<IActionResult> UseChatGPT(string query)
    {
        // Base Prompt, not complete
        string basePrompt = "Only continue and try to predict what the user wanted to say. Only use one centence. " +
            "Please only continue the frazes with that a person with impeard speach would say to comunicate with people." +
            " General Expressions that people will use in there day to day life.";
        string GPT_API_KEY = _configuration.GetConnectionString("GPT_API_KEY");

        OpenAIAPI api = new OpenAIAPI(GPT_API_KEY);
        var chat = api.Chat.CreateConversation();
        chat.AppendUserInput(query + basePrompt);
        chat.Model = Model.GPT4_Turbo;

        string response = await chat.GetResponseFromChatbotAsync();
        return Ok(response);

    }


}

