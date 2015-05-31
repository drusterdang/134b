# The lazy-man's combining of all our js files 
# Wow, So make, very GNU, Wow

TARGET  := combine.js
SOURCES := jquery-1.11.2.min.js Chart.js velocity.min.js parse.js part.js crud.js data.js helpers.js popup.js 

$(TARGET): $(SOURCES)
	cat $(SOURCES) > $(TARGET)

clean: 
	rm $(TARGET)

new: clean $(TARGET)

.PHONY:
	clean
	new
