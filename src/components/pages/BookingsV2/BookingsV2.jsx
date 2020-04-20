import React, {Component} from 'react'
import {useFilters, usePagination, useSortBy, useTable} from 'react-table'
import styled from 'styled-components'
import makeData from "./data"
import Main from '../../layout/Main'
import Titles from "../../layout/Titles/Titles"
import Icon from '../../layout/Icon'

class BookingV2 extends Component {

  constructor() {
    super()
    let datas = makeData(20)
    this.state = {
      initialData: datas,
      data: datas,
    }
  }

  handleSubmit = () => event => {
    event.preventDefault()
    let filter = [event.target.recherche.value]
    let key = event.target.choix.value
    const new_datas = this.state.initialData.filter(item => {
      return item[key].lastname.includes(filter)
    })
    this.setState({data: new_datas})
  }

  render() {
    const columns = [{
      Header: 'Réservations',
      columns: [
        {
          Header: <span className="grey_value">ID<Icon svg="ico-filter" /></span>,
          accessor: 'id',
          disableFilters: true,
        },
        {
          Header: <span className="grey_value">Beneficiaire<Icon svg="ico-filter" /></span>,
          accessor: 'beneficiaire',
          disableFilters: true,
          Cell: props => <div><span>{props.value.firstname} </span><br/><span className="grey_value">{props.value.lastname}</span></div>
        },
        {
          Header: 'Offre',
          accessor: 'offre',
          disableFilters: true,
        },
        {
          Header: 'date',
          accessor: 'bookingDate',
          sortBy: 'basic',
          disableFilters: true,
        },
        {
          Header: 'prix',
          accessor: 'price',
          sortBy: 'basic',
          disableFilters: true,
        },
        {
          Header: 'Nb de réservations',
          accessor: 'bookingNumber',
          sortBy: 'basic',
          disableFilters: true,
        },
        {
          Header: 'NB place restants',
          accessor: 'quantity',
          sortBy: 'basic',
          disableFilters: true,
        },
        {
          Header: 'Statut',
          accessor: 'status',
          sortBy: 'alpha',
          Filter: SelectColumnFilter,
          filter: 'includes',
        },
      ],
    }]

    return (
      <Main name="bookings">
        <Titles title="Suivi des réservations"/>
        <form onSubmit={this.handleSubmit()}>
          <select id="choix" name="choix">
            <option value="offre">Offre</option>
            <option value="beneficiaire">Beneficiaire</option>
          </select>
          <input type="text" name="recherche" placeholder="Saisir" id="A"/>
          <input
            type="submit"
            value="Go"
          />
        </form>
        <Styles>
          <Table columns={columns} data={this.state.data}/>
        </Styles>
      </Main>
    )
  }

}

export default BookingV2

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
     border: 1px solid black;
     margin-bottom: 15px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    
    .grey_value {
      color: #757575;
    }

    th,
    td {
      font-size: 0.8rem;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
    }
  }
`

function Table({columns, data}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable({
      columns,
      data,
      initialState: {pageIndex: 0},
    },
    useFilters,
    useSortBy,
    usePagination,
  )

  // Render the UI for your table
  return (
    <div>
      <table {...getTableProps()}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps)}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <div>{column.canFilter ? column.render('Filter') : null}
                  <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                </div>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              })}
            </tr>
          )
        })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        {' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        {' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        {' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        {' '}
        <span>
      Page{' '}
          <strong>
        {pageIndex + 1} of {pageOptions.length}
      </strong>{' '}
    </span>
        <span>
            | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{width: '100px'}}
          />
      </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function destructurate(preFilteredRows, id) {
  const options = new Set()
  preFilteredRows.forEach(row => {
    options.add(row.values[id])
  })
  return [...options.values()]
}

function SelectColumnFilter({
                              column: {filterValue, setFilter, preFilteredRows, id},
                            }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = destructurate(preFilteredRows, id)

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
