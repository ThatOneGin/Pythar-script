---standard stdout function for pytharscript
---@return nil
function printf(indentLevel, ...)
    if type(...) == "table" then
        local str = ""
        local arr = ...
        local indentStr = " "

        if(indentLevel == nil) then
            print(printf(0, arr))
            return
        end

        for i = 0, indentLevel do
            indentStr = indentStr.."\t"
        end

        for index,value in pairs(arr) do
            if type(value) == "table" then
                str = str..indentStr..index..": \n"..printf((indentLevel + 1), arr)
            else
                str = str..indentStr..index..": "..value.."\n"
            end
        end
    else
        print(...)
    end
end

function map(a, func)
    if a == nil then
        print("Error: on `map` function missing `a` parameter.") os.exit(1)
        return 1
    elseif a == nil then
        print("Error: on `map` function missing `func` parameter.")
        os.exit(1)
        return 1
    end

    for _,v in pairs(a) do
        if type(v) == "table" then
            map(v, func)
        else
            v = func(v)
        end
    end
end

function input()
    return io.read()
end

-- math

function fibonacci(n, times)
    if times <= 0 then
        return n
    end

    return fibonacci(n, (times - 1))
end

pi = math.pi
MAX = math.huge
e = 2.71828

function cos(x)
    return math.cos(x)
end

function sin(x)
    return math.sin(x)
end

function max(x, ...)
    return math.max(x, ...)
end

function ceil(x)
    return math.ceil(x)
end

function exp(x)
    return math.exp(x)
end

function sigmoid(x)
    if type(x) ~= "number" then print("Type of argument `x` is not a number "..type(x)..".") os.exit(1) end
    return 1 / (1 + exp(-x))
end

function relu(x, max)
    if max == nil then max = x end
    if type(x) ~= "number" then print("Relu parameter is not a number. `x`") os.exit(1) end

    return math.max(0, max)
end

function dsigmoid(x)
    return sigmoid(x) * (1 - sigmoid(x))
end

--strings, i may put this in other file.

function rep(string_, i, sep)
    local str = ""
    for k=1, i do
        str = str + string_ + sep
    end
    return str
end

function sub(str, start, end_)
    return string.sub(str, start, end_)
end

function format(str, ...)
    return string.format(str, ...)
end
