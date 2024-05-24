# 6502websandbox
*Note: This repository is no longer being worked on by its owner, but you can still contribute using pull requests.*
## Introduction
6502websandbox is a webpage able to emulate a 6502 processor with custom memory usage and outputs, based out of [6502js](https://github.com/skilldrick/6502js).
The way the webpage is built is in a couple of windows: one for the 6502 processor, another for the memory management, and the last for the output.
You can try it out [here](https://ponali.github.io/6502websandbox/).
## 6502 Window
Start with inserting some 6502 assembly on the large text box. When you want to assemble it, click on the Assemble button on top.
When it is done assembling, you run the machine code. Click on Run to run it as normal. For debugging, toggle the Debugger checkmark.
## Memory window
### Memory management
At the top, you can see a 1-dimensional representation of the current memory settings.
At the bottom, you can choose how which components use the memory. Please note that the "end" value is actually the last memory address it uses.
### Monitor
To activate the monitor, click on the checkmark. The start and length values are in hexadecimal.
The monitor lets you see what is in the memory, with the parameters start and length.
## Output window
The output window lets you choose which output to use for the 6502 to use. This will affect the memory management window, so please check for any inconsistencies with the memory settings after choosing.
There exist 3 currently available outputs: 32x32 screen, 128x32 2D character array, and a LCD screen simulation.
### 32x32 screen
This output uses $400 in the memory. Every 8-bit number correspond to a pixel's color. [Here](https://upload.wikimedia.org/wikipedia/commons/1/15/Xterm_256color_chart.svg) is the color palette used.
The pixels go from left to right, up to bottom.
### 128x32 2D character array
This output uses $1000 in the memory. Every 8-bit number correspond to an ASCII character. Like the 32x32 screen, the characters go from left to right, up to bottom. There is no ANSI support.
### LCD simulation
This output uses 2 characters in memory. This is based off of the LCD screen put in [Ben eater's 6502 computer](https://eater.net/6502). [Here](https://www.sparkfun.com/datasheets/LCD/HD44780.pdf) is the manual. Initialization managing has not been added yet.
