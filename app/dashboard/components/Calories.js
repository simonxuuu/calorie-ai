export default function Calories({currentCalories, targetCalories}) {
    const progress = Math.min((currentCalories / targetCalories) * 100, 100);
    return (
        <div className="caloriesBar">
            
        </div>
    );
}