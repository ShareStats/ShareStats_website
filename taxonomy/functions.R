copyOnClick <- function(text, class = "tag") {
  
  # Remove all white space to create a valid ID
  id <- gsub("[[:space:]]", "", text)
  
  # URL encode the text for use in a query string
  query <- utils::URLencode(text, reserved = TRUE)
  
  # Create the HTML hyperlink
  html.markup <- paste0('<a id="', id, '" class="', class, 
                        '" href="https://www.sharestats.nl/items-df.html?query=', query, 
                        '">', text, '</a>')
  
  return(html.markup)
}

# Example usage:
# copyOnClick("Mijn mooie tag")