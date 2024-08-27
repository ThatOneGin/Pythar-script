---Standard math library of Pythar.
Math = {}

---Fibonacci sequence function.
---@param n number
---@param times number
---@return number
function Math.fibonacci(n, times)
    if times <= 0 then
        return n
    end

    return Math.fibonacci(n, (times - 1))
end

---number of pi.
Math.pi = math.pi

---largest number than any integer.
Math.MAX = math.huge

---Number of Euler.
Math.e = 2.71828

function Math.cos(x)
    return math.cos(x)
end

---
---@param x number
---@return number
function Math.sin(x)
    return math.sin(x)
end

---returns max integer in (x, . . .)
---
---if x < ...
---return the largest integer in ... otherwise, it returns x.
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

function Math.exp(x)
    return math.exp(x)
end

function Math.sigmoid(x)
    if type(x) ~= "number" then print("Type of argument `x` is not a number "..type(x)..".") os.exit(1) end
    return 1 / (1 + Math.exp(-x))
end

function Math.relu(x, max)
    if max == nil then max = x end
    if type(x) ~= "number" then print("Relu parameter is not a number. `x`") os.exit(1) end

    return math.max(0, max)
end

function Math.dsigmoid(x)
    return Math.sigmoid(x) * (1 - Math.sigmoid(x))
end

return Math