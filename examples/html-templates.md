# HTML Template Examples

HTML rendering and templates in 10x.

## Basic HTML

@html <div>Hello</div>.
@html <span>World</span>.
@html <p>Paragraph</p>.

## Attributes

@html <div id="my-div">Content</div>.
@html <input type="text" value="hello">.
@html <button class="btn btn-primary">Click</button>.

## Styles

@html <div style="color: red">Red text</div>.
@html <div style="background: blue; color: white">Styled</div>.
@html <div style="padding: 1rem; margin: 0.5rem">Box</div>.

## Interpolation

name = "World".
@html <h1>Hello, #{name}!</h1>.

count = 42.
@html <p>Count: #{count}</p>.

## Dynamic Attributes

color = "red".
@html <div style="color: #{color}">Colored</div>.

id = "my-element".
@html <div id="#{id}">Identified</div>.

## Event Handlers

handler = @on :click.
@html <button onclick={handler}>Click me</button>.

inc = @on count = count + 1.
@html <button onclick={inc}>Increment</button>.

## Nested Elements

@html
  <div>
    <h1>Title</h1>
    <p>Paragraph</p>
  </div>.

@html
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>.

## Self-Closing Tags

@html <input type="text">.
@html <img src="image.png" alt="Image">.
@html <br>.

## Forms

@html
  <form>
    <label>Name:</label>
    <input type="text" name="name">
    <button type="submit">Submit</button>
  </form>.

## @render Directive

@render "#app" @html <div>Rendered to #app</div>.
@render "#output" @html <span>Output here</span>.

## Shadow DOM

@render @shadow @html
  <style>.box { color: red; }</style>
  <div class="box">Shadow DOM</div>.
