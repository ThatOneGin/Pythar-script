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