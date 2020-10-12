const username = "catherinelgee"
const profilePic = "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mandelbrot_sequence_new.gif"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let response 
  var links = [{ "name": "Profile picture source", "url": "https://en.wikipedia.org/wiki/Fractal#/media/File:Mandelbrot_sequence_new.gif" },
              { "name": "Fractal Video (that I made!)", "url": "https://www.youtube.com/watch?v=rit9KwyWoJ8" }, 
              { "name": "Vote!", "url": "https://www.vote.org/" }]

  const path = request.url
  if (path.includes("/links")) {
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      } }
    return new Response(JSON.stringify(links), init)
  } else {
      response = await fetch("https://static-links-page.signalnerve.workers.dev")
      return new HTMLRewriter()
        .on("div#links", new LinksTransformer(links))
        .on("div#profile", new ElementHandler())
        .on("img#avatar", new ElementHandler())
        .on("h1#name", new ElementHandler())
        .transform(response)
  }
}

class ElementHandler {
  async element(element) {
    switch (element.tagName) {
      case "div":
        const newStyle = element.getAttribute("style").replace("display: none", "")
        element.setAttribute("style", newStyle)
        break;
      case "img":
        element.setAttribute("src", profilePic)
        break;
      case "h1":
        element.setInnerContent(username)
        break;
    }
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    this.links.forEach(link => {
      element.append("<a href=" + link.url + ">" + link.name + "</a>", { html: true})
    });
  }
}

