# Ember Sword - Local Land Reward Scale

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Calculation Breakdown

Using the information provided by ES from the sources below, I wrote a simple algorithm that iterates
through each plot and calculates using the "20x20" area how each plot affects the rewards of the plots
within the local area based on the multipliers of each plot type.

After that, I recreated the map to allow filter by the average rewards scale based on plot types (Regular,
Settlement, Town, City).

For calculation purposes, I have assumed that the Capital multiplier is the same as the City multiplier
(125) since this information is not available. Also, the "20x20" is a grey area because there is no way to
have a square taking individual plots only into consideration. So on the top, you have two options, 21x21 or
19x19 area.
          
Minimum Reward is the minimum that a plot will receive if one of the local plots sells something.

Maximum Reward is the maximum that a plot will receive if one of the local plots sells something.

Average Reward is the Arithmetic Mean of all rewards obtained from the algorithm calculations.


### Sources

ES Medium Blog Post: https://medium.com/embersword/the-vision-of-ember-sword-the-land-sale-1998be5e3fe5
 
ES Website Map JSON: https://embersword.com/map/solarwood.json
 
