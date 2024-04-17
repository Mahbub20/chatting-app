using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace chatBackendAPI.Contracts
{
    public interface IReadOnlyUnitOfWork : IDisposable
    {
        IRepository<TEntity> Repository<TEntity>() where TEntity : class;
    }
}