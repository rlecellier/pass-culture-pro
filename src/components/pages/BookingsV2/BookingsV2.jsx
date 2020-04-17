import React from 'react'
import { useFilters, usePagination, useSortBy, useTable } from 'react-table'
import styled from 'styled-components'
import makeData from "./data"
import Main from '../../layout/Main'
import Titles from "../../layout/Titles/Titles"

const Styles = styled.div`
  padding: 1rem;
  
  table {
    border-spacing: 0;
     border-right: 1px solid black;
  
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
  
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
  
      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({columns, data}) {
  // Use the state and functions returned from useTable to build your UI
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
    state: { pageIndex, pageSize },
  } = useTable({
      columns,
      data,
      initialState: { pageIndex: 0 },
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
  </button>{' '}
    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
      {'<'}
    </button>{' '}
    <button onClick={() => nextPage()} disabled={!canNextPage}>
      {'>'}
    </button>{' '}
    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
      {'>>'}
    </button>{' '}
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
        style={{ width: '100px' }}
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


function SelectColumnFilter({
                              column: { filterValue, setFilter, preFilteredRows, id },
                            }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

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

function BookingsV2() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Réservations',
        columns: [
          {
            Header: 'ID',
            accessor: 'id',
            manualSortBy: 'basic',
          },
          {
            Header: 'date',
            accessor: 'bookingDate',
            sortBy: 'basic',
          },
          {
            Header: 'prix',
            accessor: 'price',
            sortBy: 'basic',
          },
          {
            Header: 'Nb de réservations',
            accessor: 'bookingNumber',
            sortBy: 'basic',
          },
          {
            Header: 'NB place restants',
            accessor: 'quantity',
            sortBy: 'basic',
          },
          {
            Header: 'Statut',
            accessor: 'status',
            sortBy: 'alpha',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
        ],
      },
    ],
    [],
  )

  const data = React.useMemo(() => makeData(20), [])

  return (
    <Main name="bookings">
      <Titles title="Suivi des réservations"/>
      <Styles>
        <Table columns={columns} data={data}/>
      </Styles>
    </Main>
  )
}

export default BookingsV2
