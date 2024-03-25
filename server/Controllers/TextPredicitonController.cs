// API to manage text prediction and text genration using GPT API

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Models;
using server.DTOs;
namespace server.Controllers;



    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TextPredictionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TextPredictionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }


    [HttpPost]
    public async Task<IActionResult> UseChatGPT([FromBody] TextPredictionBody query)
    {
        if (!(string.IsNullOrEmpty(query.text)))
        {
            // Create a new OpenAiAPI object, requires API KEY
            OpenAIAPI api = new OpenAIAPI();

            // Extract the word from the query text
            var word = query.text;

            // Creating a chat completion of the input query (input text)
            var result = await api.Chat.CreateChatCompletionAsync(new ChatRequest()
            {
                Model = Model.ChatGPTTurbo, // Specifying Model
                Temperature = 0.1,
                MaxTokens = 50,  // Max tokens to be predicted
                Messages = new ChatMessage[]
                {
                // Requesting Chat Completion from model, with the given prompt
                new ChatMessage(ChatMessageRole.User, $"Find sentences related to the word '{word}'"),

                }
            });

            // Extracting the sentences related to the word
            var sentences = new List<string>();
            var completion = result.ToString();
            var completionParts = completion.Split("user: ");
            foreach (var part in completionParts)
            {
                if (part.Contains(word))
                {
                    var sentence = part.Split('\n')[0].Trim();
                    if (!sentences.Contains(sentence))
                    {
                        sentences.Add(sentence + ".");
                    }
                    if (sentences.Count >= 3) break;
                }
            }

            // Return the predicted completion by the model
            return Ok(new { sentences });
        }
        return Ok(""); // If Query empty return empty string
    }


}

