# Pythar-Script
Pythar-script is a language that can be interpreted directly, transpiled to lua (having almost all lua functions) or directly from command-line.
It mainly uses functions.

* obs: the transpiler targets lua5.4.

### this project is under development and if you i'll use it, you can find some problems with it.

## Dependencies
  ### - Deno
  ### - Lua5.4 (if using transpiler)

## install on windows:
  1. clone the repository using:
     `git clone https://github.com/ThatOneGin/Pythar-script.git`
  3. or extract files.
  4. put extracted or cloned files in whatever directory you want.
  5. and finally, put the executable in environment path.
  6. (optional) check if the installation was successful by running `psc`

## install on linux:
  1. clone the repository using:
    `git clone https://github.com/ThatOneGin/Pythar-script.git`
  2. or extract files.
  3. put the executable in PATH.
  4. (optional) check if the installation was successful by running `psc`

## Basics:
   - declare variables using let and const (as normal):
  
  `let|const <identifier> = <value>`
  
  - declare functions using fn keyword looking like this:
  
  `fn <name>(<args>) { <body> }`

  - for loops (transpiler):

  `for(<initialvalue>; <condition>; <update>) { <body> }`

  - if statements:

  `if (<condition>) { <if_body> }`

  there are some basic types: null, number, string, identifier and ponctuaction characters.

this language base is also mostly based on tylerlaceby guide-to-interpreter series

reference: https://github.com/tlaceby/guide-to-interpreters-series/tree/main
