# The lazy-man's combining of all our js files 
# Wow, So make, very GNU, Wow

TARGET  := combine.js
SOURCES := $(filter-out $(TARGET), $(wildcard *.js))

$(TARGET): $(SOURCES)
	cat $(SOURCES) > $(TARGET)

clean: 
	rm $(TARGET)

new: clean $(TARGET)

.PHONY:
	clean
	new
