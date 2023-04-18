// Only change code below this line
function urlSlug(title) {
  return title
    .toLowerCase()
    .split(/\W+/)
    .join('-')
  }
  // Only change code above this line
  console.log(urlSlug("A Mind Needs Books Like A Sword Needs A Whetstone"))
  console.log(urlSlug(" Winter Is  Coming"))
