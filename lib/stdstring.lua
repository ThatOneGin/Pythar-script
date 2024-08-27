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

function split(str, delimiter)
    local arr = {}
    if delimiter == nil then
        delimiter = " "
    end
    for str in string.gmatch(str, "([^"..delimiter.."]+)") do
        table.insert(arr, str)
    end
    return arr
end