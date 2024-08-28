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
    subprint(value)
end


---standard stdin for Pythar
---@return any
function prompt()
    return io.read()
end