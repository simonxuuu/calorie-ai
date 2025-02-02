export default function Calories({dailyCalories, targetCalories}) {
    const progress = Math.min((dailyCalories / targetCalories) * 100, 100);
    return (
        <div className="caloriesBar">
            
        </div>
    );
}