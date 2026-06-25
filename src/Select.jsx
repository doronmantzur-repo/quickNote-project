export default function Select({onChange, value}) {
  return (
    <select name="category" id="category" value={value} onClick={(e) => e.stopPropagation()} onChange={(e) => onChange(e.target.value)}>
      <option value="" disabled>Select category</option>
      <option value="home">Home</option>
      <option value="work">Work</option>
      <option value="shopping">Shopping</option>
      <option value="academy">Academy</option>
    </select>
  );
}


// disabled selected