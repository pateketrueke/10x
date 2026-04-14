# Shopping Cart Example

Reactive shopping cart with computed totals, item management, and derived state.

## State

items = @signal [].

## Sample Data

addItem = @on
  items = items |> push(:name "Widget", :price 9.99, :qty 1).

addExpensive = @on
  items = items |> push(:name "Gadget Pro", :price 49.99, :qty 1).

clearCart = @on items = [].

## Computed Values

itemCount = @computed items |> size.

subtotal = @computed
  items |> map((i) -> i.price * i.qty) |> (list -> list |> reduce((a b) -> a + b, 0)).

tax = @computed subtotal * 0.08.

total = @computed subtotal + tax.

## View

@render "#app" @html
  <div class="cart">
    <h1>Shopping Cart</h1>
    
    <div class="actions">
      <button onclick={addItem}>Add Widget ($9.99)</button>
      <button onclick={addExpensive}>Add Gadget ($49.99)</button>
      <button onclick={clearCart}>Clear</button>
    </div>
    
    <ul class="items">
      #{items |> map((item i) ->
        <li>
          <span class="name">#{item.name}</span>
          <span class="price">$#{item.price}</span>
          <span class="qty">×#{item.qty}</span>
        </li>
      )}
    </ul>
    
    <div class="summary">
      <p>Items: #{itemCount}</p>
      <p>Subtotal: $#{subtotal}</p>
      <p>Tax (8%): $#{tax}</p>
      <p class="total">Total: $#{total}</p>
    </div>
  </div>.
