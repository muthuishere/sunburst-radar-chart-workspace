export function convertToPercentage(input) {

  let {plotMax, actualScore, maxScore} = input;


  if (actualScore > maxScore) {
    actualScore = maxScore;
  }
  const perValue = plotMax / maxScore;
  return actualScore * perValue;
}
