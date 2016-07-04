import Adafruit_MCP9808.MCP9808 as MCP9808

sensor = MCP9808.MCP9808()

sensor.begin()
temp = sensor.readTempC()
print(temp)

