const express = require('express');
const router = express.Router();
const db = require('../db');

const PRECIO_FIJO = parseFloat(process.env.PRECIO_FIJO);

router.post('/consumo', async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ error: 'Código requerido' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Buscar usuario
    const [usuarios] = await connection.query(
      'SELECT * FROM usuarios WHERE codigo_barra = ? AND activo = 1',
      [codigo]
    );

    if (usuarios.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = usuarios[0];

    // Registrar consumo
    await connection.query(
      'INSERT INTO consumos (usuario_id, monto) VALUES (?, ?)',
      [usuario.id, PRECIO_FIJO]
    );

    // Actualizar deuda
    await connection.query(
      'UPDATE usuarios SET deuda_total = deuda_total + ? WHERE id = ?',
      [PRECIO_FIJO, usuario.id]
    );

    await connection.commit();

    res.json({
      usuario: usuario.nombre,
      monto: PRECIO_FIJO,
      deuda_total: parseFloat(usuario.deuda_total) + PRECIO_FIJO,
      mensaje: 'Consumo registrado correctamente'
    });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: 'Error al registrar consumo' });
  } finally {
    connection.release();
  }
});

module.exports = router;