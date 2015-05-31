# The lazy-man's combining of all our js files 
# Wow, So make, very GNU, Wow

TARGET  := combine.js
SOURCES := Chart.js crud.js jquery-1.11.2.min.js velocity.min.js main.js

$(TARGET): $(SOURCES)
	cat $(SOURCES) > $(TARGET)

clean: 
	rm $(TARGET)

new: clean $(TARGET)

.PHONY:
	clean
	new
