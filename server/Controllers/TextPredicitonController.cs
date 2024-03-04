// API to manage text prediction and text genration using GPT API

using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Models;
using server.DTOs;


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

  
    // API endpoint to return completion of input using Open AI GPT API 
    [HttpPost]
    public async Task<IActionResult> UseChatGPT([FromBody] TextPredictionBody query)
    {
       
        if (!(string.IsNullOrEmpty(query.text)))
        {
            // Creatin new OpenAiAPI object, requiers API KEY
            OpenAIAPI api = new OpenAIAPI();

            // Creating a chat completion of the input query (input text)
            var result = await api.Chat.CreateChatCompletionAsync(new ChatRequest()
            {

                Model = Model.ChatGPTTurbo, // Sepcifing Model
                Temperature = 0.1,
                MaxTokens = 2,  //Max tokens to be predicted
                Messages = new ChatMessage[]
                {
                // Requesting Chat Completion from model, with the given prompt
                new ChatMessage(ChatMessageRole.User, $"Compose exactly the next part of your message: {query.text}"),

                }
            });

            //Return the predicted completion by the moode
            return Ok(new { predictions = result.ToString() });
        }
        return Ok(""); //If Querry empty return empty string
    }




}

