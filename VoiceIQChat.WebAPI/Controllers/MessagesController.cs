using PusherServer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using VoiceIQChat.WebAPI.Models;

namespace VoiceIQChat.WebAPI.Controllers
{

    [EnableCors("*", "*", "*")]
    public class MessagesController : ApiController
    {
        private static List<ChatMessage> messages =
            new List<ChatMessage>()
            {
                new ChatMessage
                {
                    AuthorTwitterHandle = "Pusher",
                    Text = "Hi there! ?"
                },
                new ChatMessage
                {
                    AuthorTwitterHandle = "Pusher",
                    Text = "Welcome to your chat app"
                }
            };
        public HttpResponseMessage Get()
        {
            return Request.CreateResponse(
                HttpStatusCode.OK,
                messages);
        }

 
        public HttpResponseMessage Post(ChatMessage message)
        {
            if (message == null || !ModelState.IsValid)
            {
                return Request.CreateErrorResponse(
                    HttpStatusCode.BadRequest,
                    "Invalid input");
            }
            messages.Add(message);

            var pusher = new Pusher(
                "505249",
                "20012b9e7339e931c542",
                "82cbac5077eddbdcd4e9",
                   new PusherOptions
                   {
                       Cluster = "ap2"
                   });

            pusher.TriggerAsync(
                channelName: "messages",
                eventName: "new_message",
                data: new
                {
                    AuthorTwitterHandle = message.AuthorTwitterHandle,
                    Text = message.Text
                });

            return Request.CreateResponse(HttpStatusCode.Created);
        }

    }
}
