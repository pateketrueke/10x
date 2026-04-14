# UI Components Module

Reusable UI components.

## Imports

@import signal, html, render, on @from "Runtime".

## Exports

@export Button, Card, Input, List.

## Button Component

Button props =>
  @html
    <button
      class="btn #{props.variant}"
      onclick={props.onClick}
      disabled={props.disabled}
    >
      #{props.label}
    </button>.

## Card Component

Card props =>
  @html
    <div class="card">
      @if props.title
        <h3 class="card-title">#{props.title}</h3>
      <div class="card-body">
        #{props.children}
      </div>
    </div>.

## Input Component

Input props =>
  value = @signal props.value,
  onChange = @on value = event.target.value,
  @html
    <div class="input-group">
      @if props.label
        <label>#{props.label}</label>
      <input
        type={props.type}
        value={value}
        oninput={onChange}
        placeholder={props.placeholder}
      >
    </div>.

## List Component

List props =>
  @html
    <ul class="list">
      #{map(props.items, (item i) -> <li key={i}>#{item}</li>)}
    </ul>.
