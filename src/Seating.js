import parliamentSVG from 'parliament-svg/dist'

const obj = parties =>
  parties.reduce((result, party) => ({...result, [party.abbrivation]: party}), {})

const Seating = ({parties, seatCount = true}) =>
  parliamentSVG(obj(parties), seatCount)

export default Seating
