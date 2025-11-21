import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLabResults } from '../../services/labResultService'
import { Stack, Typography, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip } from '@mui/material'
import { Link } from 'react-router-dom'

export default function LabResultsList() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['labResults', page], queryFn: () => getLabResults({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1
  return (
    <Stack gap={2}>
      <Typography variant="h5">Lab Results</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={2}>No lab results</TableCell></TableRow>
          ) : (
            items.map(r => (
              <TableRow key={r.id} hover component={Link} to={`/lab/results/${r.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{r.labOrderId}</TableCell>
                <TableCell><Chip label={r.status} /></TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}