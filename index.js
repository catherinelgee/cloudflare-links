const username = "catherinelgee"
const profilePic = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0-8dxa3GlIP9iE8iyB2axE&ust=1602587761066000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCOis5ub2ruwCFQAAAAAdAAAAABAD"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let response 
  var links = [{ "name": "One", "url": "https://google.com" },
              { "name": "Two", "url": "https://google.com" }, 
              { "name": "Three", "url": "https://google.com" }]

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

