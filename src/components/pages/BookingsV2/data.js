const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newStock = () => {
  return {
    id: Math.floor(Math.random() * 100),
    beneficiaire: {
        lastname: Math.random().toString(36).substring(7),
        firstname: Math.random().toString(36).substring(7),
    },
    offre: Math.random().toString(36).substring(7),
    bookingDate: "11/05/2020",
    isDuo: (Math.random() >= 0.5),
    status: Math.random().toString(36).substring(7),
  }
}

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newStock(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
