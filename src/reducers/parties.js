import { 
  balanceRemainingVotes, 
  calculatePercentages, 
  control, 
  selectAndAssignSeat 
} from '../lib/parties'

const rawState = [
  { id: 1, name: "Kristdemokraterna", votes: 11695},
  { id: 2, name: "Moderaterna", votes: 15200},
  { id: 3, name: "Liberalerna", votes: 10538},
  { id: 4, name: "Centerpartiet", votes: 11746},
  { id: 5, name: "Socialdemokraterna", votes: 43696},
  { id: 6, name: "Miljöpartiet", votes: 4354},
  { id: 7, name: "Vänsterpartiet", votes: 7864},
  { id: 8, name: "Sverigedemokraterna", votes: 11250},
  { id: 9, name: "FI", votes: 3000},
  { id: 10, name: "Övriga", votes: 3000}
]

const range = nr => [...Array(nr).keys()]
const countTotal = parties => parties.reduce((total, party) => total+party.votes, 0)
const maxVotes = countTotal(rawState)
const percentage = calculatePercentages(rawState)
const initialState = balanceRemainingVotes(rawState, maxVotes).map(percentage)
const updateParty = (party, votes) => ({
  ...party, 
  votes: Math.round(votes / 100 * maxVotes),
  changed: new Date()
})

export default function(state = initialState, action) {
  switch (action.type){
    case "UPDATE_PARTY_VALUE": {
      const updatedParties = state
        .map(party => party.name === action.partyName ? updateParty(party, action.value) : party)
        .map(percentage)

      // minimize the diff as much as we can on ten iterations
      const normalized = range(10)
        .reduce((parties) => balanceRemainingVotes(parties, maxVotes), updatedParties)
        .map(percentage)
        .map(control)

      // assign each seat to each party:
      const seats = range(349).reduce((parties, seat) => selectAndAssignSeat(parties, seat), normalized)
      return seats
    }
    default: return state
  }
}
