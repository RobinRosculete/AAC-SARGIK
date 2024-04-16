// API to manage text prediction and text genration using GPT API

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Models;
using server.DTOs;
using System.Text.RegularExpressions;
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

    //APi endpoint to acces GPT API
    [HttpPost]

    public async Task<IActionResult> UseChatGPT([FromBody] string[] imageClasses)
    {
        if (imageClasses != null && imageClasses.Length > 0)
        {
            // Create a new OpenAiAPI object, requires API KEY
            string apiKey = _configuration["GPT-API-KEY"];
            OpenAIAPI api = new OpenAIAPI(apiKey);

            // Creating a chat completion of the input query (input text)
            var result = await api.Chat.CreateChatCompletionAsync(new ChatRequest()
            {
                Model = Model.ChatGPTTurbo, // Specifying Model
                Temperature = 0.1,
                MaxTokens = 90,  // Max tokens to be predicted (30 tokens per sentence, 3 sentences)
                Messages = new ChatMessage[]
                {
                // Requesting Chat Completion from model, with the given prompt
                new ChatMessage(ChatMessageRole.User, $"I am working on an assistive communication tool for people with communication disorders. Given a list of image classes, " +
                    $"I need your help generating short, first-person sentences expressing basic wants, needs, observations, or feelings related to those classes. " +
                    $"\n\nHere are some guidelines:\n\n* **Keep it simple.** Use clear, everyday language.\n* **Focus on the immediate.** " +
                    $"Think about what someone might want to express right now based on the visual information.\n* **Variety is key.**  " +
                    $"Offer a few different options, showing several ways to relate to the image classes.\n\n**Example image classes:" +
                    $"** dog, park, smile\n\n**Possible Responses:**\n* \"I want to pet the dog.\"\n* \"The park looks fun!\"\n* \"That smile makes me happy.\" " +
                    $"\n\n**New image classes:** {string.Join(", ", imageClasses)}  ")
                }
            });

            // Spliting the resut into an array of sentences
            // Split the result into an array of sentences and filter out non-letter characters
            var sentences = result.ToString().Split("\n")
                .Select(s => Regex.Replace(s.Trim(), @"[^A-Za-z\s]", ""))
                .Where(s => !string.IsNullOrEmpty(s))
                .Take(3)
                .Select(s => s.Replace("* ", "").Trim())
                .ToArray();


            // Return the array of generated sentences
            return Ok(new { sentences });
        }
        return BadRequest("No classes detected in the image.");
    }


}

