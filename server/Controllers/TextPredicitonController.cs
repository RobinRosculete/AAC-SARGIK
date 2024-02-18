using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Chat;
using OpenAI_API.Models;
using server.DTOs;
using static System.Net.Mime.MediaTypeNames;

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

    // post: api/TextPrediciton
    [HttpPost]
    public async Task<IActionResult> UseChatGPT([FromBody] TextPredictionBody query)
    {
        if (!(string.IsNullOrEmpty(query.text)))
        {
            OpenAIAPI api = new OpenAIAPI();
            var result = await api.Chat.CreateChatCompletionAsync(new ChatRequest()
            {
                Model = Model.ChatGPTTurbo,
                Temperature = 0.1,
                MaxTokens = 5,
                Messages = new ChatMessage[]
                {
                new ChatMessage(ChatMessageRole.User, $"Compose exactly the next part of your message: {query.text}"),

                }
            });

            return Ok(new { predictions = result.ToString() });
        }
        return Ok("");
    }




}

