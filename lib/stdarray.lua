function map(array, func)
    if array == nil then
        print("Error: on `map` function missing `array` parameter.") 
        os.exit(1)
    elseif array == nil then
        print("Error: on `map` function missing `func` parameter.")
        os.exit(1)
    end

    for _,v in pairs(array) do
        if type(v) == "table" then
            map(v, func)
        else
            v = func(v)
        end
    end
end