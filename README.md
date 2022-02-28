It would be helpful if you could document your project (through comments or README files) and explain some of the decisions/assumptions you have made. 
Given the short time constraints, please also make notes of future steps you could take to make the application better.


LOUISE HELLBERGS SCHIBSTED CASE
I was choosing among some different structures, at first I thought I would use a MVC structure but then I decided not to since I was not expecting a large project 
with many views. My first thought was also to use webpack etc but because of time limitation I chose not to since I had some pre knowledge of Vanilla javascript 
without webpack. I did not program so that the game works on a phone. I chose to focus on the possibility to choose among three pictures, puzzle difficulty 
and timing! I also chose to draw the image on the background instead of a blank grid as well as randomizing the pieces. There is a limitation for the pieces 
so that they cannot go above 400 px in y axis = only lower section of window. I used context, canvas and drawimage to get a dividable image, it seemed to be 
the easiest. A piece-class is made to handle and draw the pieces. I tried to avoid put the logic in the html-file


Improvements that can be made are:
- Structuring the code better and dividing it into several scripts
- Make the images code more dynamic
- Randomize puzzle pieces to not cover the image in the middle
- more features :))
- Investigate if Window.requestAnimationFrame()is good enough performance wise, might be nicer to update frame when something is changing instead of 60 times/second.
