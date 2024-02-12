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
    [Authorize]
    public class TextPredictionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TextPredictionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

    // post: api/TextPrediciton
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
                new ChatMessage(ChatMessageRole.User, $"Predict the possible next word or sentence that starts with: {query.text}"),
                new ChatMessage(ChatMessageRole.System, "You can continue the input without introducing new information.")
                }
            });

            return Ok(new { prediction = result.ToString() });
        }
        return Ok("");
    }



}

