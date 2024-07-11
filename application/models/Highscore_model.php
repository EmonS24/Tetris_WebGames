<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Highscore_model extends CI_Model
{

    public function get_highscores()
    {
        $this->db->order_by('score', 'DESC');
        $query = $this->db->get('highscores', 5);
        return $query->result_array();
    }

    public function save_score($data)
    {
        $this->db->insert('highscores', $data);
    }
}
