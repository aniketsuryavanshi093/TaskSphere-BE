export const paginator = async (collection, pageNumber, pageSize) => {
  const skipCount = (pageNumber - 1) * pageSize
  const data = await collection.skip(skipCount).limit(pageSize)
  const count = await collection.countDocuments()
  const totalPages = Math.ceil(count / pageSize)
  const currentPage = pageNumber
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1
  const nextPage = hasNextPage ? currentPage + 1 : null
  const prevPage = hasPrevPage ? currentPage - 1 : null
  const itemsPerPage = pageSize
  const remainingItems = count - (skipCount + data.length)
  return {
    data,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalPages,
    itemsPerPage,
    remainingItems,
  }
}
