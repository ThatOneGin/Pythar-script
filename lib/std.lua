---Standard array library of Pythar
---@class ARRAYLIB
Array = {}

---iterates over given array and executes function in each element
---@param array table
---@param func function
function Array.map(array, func)
    if array == nil then
        print("Error: on `map` function missing `array` parameter.")
        os.exit(1)
    elseif array == nil then
        print("Error: on `map` function missing `func` parameter.")
        os.exit(1)
    end

    for _,v in pairs(array) do
        if type(v) == "table" then
            Array.map(v, func)
        else
            v = func(v)
        end
    end
end
---Returns true if given array contains search otherwise returns false.
---@param array table
---@param search any
---@return boolean
function Array.find(array, search)
    for i=1, #array do
        if array[i] == search or array[-i] == search then
            return true
        end
    end

    return false
end
---Inserts value into given array and returns the new array.
---@param array table
---@param value any
---@return table
function Array.insert(array, value)
    table.insert(array, value)

    return array
end

---Delete the first element of given array and returns it
---@param array table
---@return any
function Array.shift(array)
    return table.remove(array, 1)
end

---Joins two arrays into one.
---@param array1 table
---@param array2 table
---@return table
function Array.join(array1, array2)
    local arr = {}
    for i,value in pairs(array1) do
        table.insert(arr, value)
    end
    for i,value in pairs(array2) do
        table.insert(arr, value)
    end
    return arr
end

---Standard input output library for pytharscript
---@class IO
Io = {}

---standard stdout function for pytharscript
---@return nil
function printf(value)
    local function subprint(arr, indentLevel)
        local str = ""
        local indentStr = ""

        if(indentLevel == nil) then
            print(subprint(arr, 0))
            return
        end

        for i = 0, indentLevel do
            indentStr = indentStr.."\t"
        end

        for index,value in pairs(arr) do
            if type(value) == "table" then
                str = str..indentStr..index..": \n"..subprint(value, (indentLevel + 1))
            else 
                str = str..indentStr..index..": "..value.."\n"
            end
        end
        return str
    end
    if type(value) == "table" then
        subprint(value)
    else
        io.write(value)
    end
end


---standard stdin for Pythar
---@return any
function Io.prompt()
    return io.read()
end

---Standard math library of Pythar.
---@class MATHLIB
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

function Math.random(minimum, maximum)
    if maximum == nil then return math.random(minimum) end
    if minimum == nil and maximum == nil then return math.random() end
    return math.random(minimum, maximum)
end

---A function based on the Standard Normal Distribution or Gaussian Distribution.
---
---f(x) = e ^ -x / 2 / 2pi ^ (1 / 2)
---@param x number|integer
---@return number
function Math.randn(x)
    local rnm = math.exp(-x ^ 2 / 2)
    local sqrtpi = (Math.pi * 2) ^ (1 / 2)
    return rnm / sqrtpi
end

---Standard string library for Pythar.
String = {}

---returns a string that is the concatenation of string_ i times separated with sep.
---@param string_ string
---@param i integer
---@param sep string
---@return string
function String.rep(string_, i, sep)
    local str = ""
    for k=1, i do
        str = str + string_ + sep
    end
    return str
end

---get all chars in range start and end_.
---@param str string
---@param start integer
---@param end_ integer
---@return string
function String.sub(str, start, end_)
    return string.sub(str, start, end_)
end

---@param str string
---@param ... any
---@return string
function String.format(str, ...)
    return string.format(str, ...)
end

---splits given string if encounters delimiter.
---@param str string
---@param delimiter? string
---@return table
function String.split(str, delimiter)
    local arr = {}
    if delimiter == nil then
        delimiter = " "
    end
    for str in string.gmatch(str, "([^"..delimiter.."]+)") do
        table.insert(arr, str)
    end
    return arr
end

---@class Matrix
---@field Matrix table
Matrix = {}

function Matrix.create(rows, cols, value)
    local mt = {}
    for i=1, rows do
        local arr = {}
        for j=1, cols do
            arr[j] =  value
        end
        table.insert(mt, arr)
    end
    return mt
end
---Returns the dot product of two arrays
---@param matrix1 table
---@param matrix2 table
---@param preservematrix false|boolean
---@return number[]|number
function Matrix.dot(matrix1, matrix2, preservematrix)
    if preservematrix == nil then preservematrix = false end
    if not preservematrix then
        local result = 0
        for i=1, #matrix1[1] do
            for j=1, #matrix2[i] do
                result = result + matrix1[i][j] * matrix2[i][j]
            end
        end
        return result
    else
        local arr = {}
        for i=1, #matrix1[1] do
            for j=1, #matrix2[i] do
                arr[i] = matrix1[i][j] * matrix2[i][j]
            end
        end
        return arr
    end
end
---Sum up two matrices together.
---@param matrix1 table[]
---@param matrix2 table[]
---@return table
function Matrix.sum(matrix1, matrix2)
    local mt = {}
    for i=1, #matrix1 do
        for j=1, #matrix2[i] do
            mt[i][j] = matrix1[i][j] + matrix2[i][j]
        end
    end
    return mt
end
---Subtract two matrices.
---@param matrix1 table[]
---@param matrix2 table[]
---@return table
function Matrix.sub(matrix1, matrix2)
    local mt = {}
    for i=1, #matrix1 do
        for j=1, #matrix2[i] do
            mt[i][j] = matrix1[i][j] - matrix2[i][j]
        end
    end
    return mt
end
---mutiplies MatrixA by the scalar (an integer/float)
---@param MatrixA table[]
---@param scalar number|integer
---@return table
function Matrix.EscalarMultiply(MatrixA, scalar)
    local matrix = Matrix.create(#MatrixA, #MatrixA[1], 0)
    for i=1, #MatrixA do
        for j=1, #MatrixA[1] do
            matrix[i][j] = MatrixA[i][j] * scalar
        end
    end
    return matrix
end
---given rows and collumns, generate a new matrix with a table called values that have (minimum, maximum) variables.
---@param rows number
---@param cols number
---@param value table
---@return table
function Matrix.RandomMatrix(rows, cols, value)
    local matrix = Matrix.create(rows, cols, 0)

    for i=1, #matrix do
        for j=1, #matrix[i] do
            matrix[i][j] = math.random(value.minimum, value.maximum)
        end
    end
    return matrix
end

---Transpose given matrix.
---
---given:
---
---[
---    [1, 2],
---    [3, 4],
---    [5, 6]
---]
---
---output should be:
---
---[
---     [1, 2, 3],
---     [4, 5, 6]
---]
---@param matrix table
---@return table
function Matrix.transpose(matrix)
    local mt = Matrix.create(#matrix[1], #matrix, 0)
    for i=1, #matrix[1] do
        for j=1, #matrix do
            mt[i][j] = matrix[j][i]
        end
    end
    return mt
end

Core = {
    Array = Array,
    Math = Math,
    String = String,
    Io = Io,
    printf = printf,
    Matrix = Matrix
}

return Core