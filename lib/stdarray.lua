---Standard array library of Pythar
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