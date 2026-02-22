import { generateNumbers } from "@/lib";

 

const TableLoader = ({
  rows = 1,
  cols = 2,
  className,
  wrapperClassName,
}: {
  rows?: number;
  cols?: number;
  className?: string;
  wrapperClassName?: string;
}) => {
  const rowsCount = generateNumbers(1, rows);
  const colsCount = generateNumbers(1, cols);
  return (
    <div className={"flex justify-center items-center grow w-full" + wrapperClassName}>
      <table className={`mx-auto w-full `}>
        <tbody>
          <tr>
            {colsCount.map((_, cIndex) => (
              <th key={cIndex}>
                <div
                  className={`my-2 mx-auto w-[80%] h-4 bg-muted rounded animate-pulse border ${className}`}
                />
              </th>
            ))}
          </tr>

          {rowsCount.map((_, index) => (
            <tr key={index}>
              {colsCount.map((_, cIndex) => (
                <td key={cIndex}>
                  <div
                    className={`my-2 mx-auto w-[80%] h-4 bg-muted/90 rounded animate-pulse border ${className}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoader;
