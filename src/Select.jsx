export default function Select({onChange, value, disabled}) {
  return (
    <select name="category" 
    id="category" 
    value={value}
    disabled = {disabled}
    onClick={(e) => e.stopPropagation()} 
    onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>Category</option>
      <option value="home">Home</option>
      <option value="work">Work</option>
      <option value="shopping">Shopping</option>
      <option value="academy">Academy</option>
    </select>
  );
}


// disabled selected