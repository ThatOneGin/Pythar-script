---Standard math library of Pythar.
Math = {}

---Fibonacci sequence function.
---@param n number
---@return number
function Math.fibonacci(n)
    if n <= 0 then
        return n
    end

    return Math.fibonacci(n - 1) + Math.fibonacci(n - 2)
end

---number of pi.
Math.pi = math.pi

---largest number than any integer.
Math.MAX = math.huge

---Number of Euler.
---@type number
Math.e = 2.71828

---returns cosine of x.
---@param x any
---@return number
function Math.cos(x)
    return math.cos(x)
end

---returns sine of x.
---@param x number
---@return number
function Math.sin(x)
    return math.sin(x)
end

---returns max integer in (x, . . .).
---
--- using operator "<"
---@param x number
---@param ... number
---@return number
function Math.max(x, ...)
    return math.max(x, ...)
end

---return the smallest integral value larger or equal than x.
---@param x number
---@return number
function Math.ceil(x)
    return math.ceil(x)
end

---returns the exponential value of "x"
---
---e ^ x
---@param x number
---@return number
function Math.exp(x)
    return math.exp(x)
end

---Sigmoid function.
---
---f(x) = 1 / (1 + e^-x)
---@param x number
---@return number
function Math.sigmoid(x)
    if type(x) ~= "number" then print("Type of argument `x` is not a number "..type(x)..".") os.exit(1) end
    return 1 / (1 + Math.exp(-x))
end

---Rectified linear unit
---
---f(x) = max(0, x)
---@param x number
---@param max number
---@return integer
function Math.relu(x, max)
    if max == nil then max = x end
    if type(x) ~= "number" then print("Relu parameter is not a number. `x`") os.exit(1) end

    return math.max(0, max)
end

---Derivative of the sigmoid function.
---
---f'(x) = f(x) * (1 - f(x))
---@param x number
---@return number
function Math.dsigmoid(x)
    return Math.sigmoid(x) * (1 - Math.sigmoid(x))
end

return Math